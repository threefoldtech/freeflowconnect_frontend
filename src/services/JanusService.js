import {JanusBuilder} from "../januswrapper/JanusBuilder";
import {VideoRoomPlugin} from "../januswrapper/VideoRoomPlugin";
import store from "../plugins/vuex";

export const initializeJanus = async (serverUrl, opaqueId, userName, roomName, stream) => {
    const janusBuilder = new JanusBuilder(serverUrl, true);
    const videoRoomPlugin = new VideoRoomPlugin(opaqueId);
    let initialJoin = true;

    videoRoomPlugin.addEventListener("pluginAttached", async (room) => {
        const roomCreationResult = await videoRoomPlugin.createRoom(roomName);
        await videoRoomPlugin.joinRoom(roomCreationResult.room, userName);
    });

    const isVideoAuthorised = false;

    videoRoomPlugin.addEventListener("ownUserJoined", (user) => {
        if (initialJoin) {
            initialJoin = false;
            stream.getTracks().forEach(async (track) => {
                await videoRoomPlugin.publishTrack(track);
            })
        }

        store.commit("setLocalUser", user);

        user.stream.getTracks().forEach((track) => {
            const kind = track.kind;

            if (kind !== "video") {
                return;
            }

            track.onended = async (event) => {
                if (!isVideoAuthorised) {
                    return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({video: true})
                await videoRoomPlugin.publishTrack(stream.getTracks()[0]);

            }
        });
    });

    videoRoomPlugin.addEventListener("userJoined", (user) => {
        if (user === store.getters.localUser) {
            return;
        }
        store.commit("addRemoteUser", user);
    });

    videoRoomPlugin.addEventListener("userLeft", (user) => {
        store.commit("deleteRemoteUser", user);
    });

    const janus = await janusBuilder.addPlugin(videoRoomPlugin).build();

    return {
        startScreenShare: async () => {
            const stream = await navigator.mediaDevices.getDisplayMedia();
            await videoRoomPlugin.publishTrack(stream.getVideoTracks()[0]);
        },
        startCamera: async () => {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
            // this.isVideoAuthorised = true
            await videoRoomPlugin.publishTrack(stream.getVideoTracks()[0]);
        },
        publishTrack: async (track) => {
            await videoRoomPlugin.publishTrack(track);
        },
        stopVideoTrack: () => {
            videoRoomPlugin.myStream.getVideoTracks()[0].stop()
        },
        stopAudioTrack: () => {
            videoRoomPlugin.myStream.getAudioTracks()[0].stop()

        },
    }
}
