<template>
    <div class="micVolumeIcon">
        <v-icon :small="small">{{ icon }}</v-icon>
        <v-icon
            :small="small"
            :style="`clip-path: inset(${100 - progress}% 0px 0 0px);`"
            color="#4cd137"
            >{{ icon }}</v-icon
        >
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'micVolumeIcon',
        props: {
            small: { type: Boolean, default: false },
            icon: { type: String, required: true },
            stream: { type: MediaStream, required: true },
        },
        data() {
            return {
                progress: 50,
                /** @type AudioContext */
                audioContext: null,
                /** @type AnalyserNode */
                analyser: null,
                /** @type MediaStreamAudioSourceNode */
                microphone: null,
            };
        },
        mounted() {
            // @todo: move this away from window
            if (!window.micVolumeIconAudioContext) {
                // console.log('generating new AudioContext');
                window.micVolumeIconAudioContext = new (window.AudioContext ||
                    window.webkitAudioContext)();
            }
            this.audioContext = window.micVolumeIconAudioContext;
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(
                this.localUser?.stream || this.stream
            );
            let javascriptNode = this.audioContext.createScriptProcessor(
                2048,
                1,
                1
            );

            this.analyser.smoothingTimeConstant = 0.8;
            this.analyser.fftSize = 32;

            this.microphone.connect(this.analyser);
            this.analyser.connect(javascriptNode);
            javascriptNode.connect(this.audioContext.destination);
            javascriptNode.onaudioprocess = () => {
                const array = new Uint8Array(this.analyser.frequencyBinCount);
                this.analyser.getByteFrequencyData(array);
                let values = 0;

                const length = array.length;
                for (let i = 0; i < length; i++) {
                    values += array[i];
                }
                const avg = values / length;
                this.progress =
                    avg > 20 && avg < 100 ? avg : avg < 20 ? 0 : 100;
            };
        },
        destroyed() {
            // console.log('destroy');
            this.analyser.disconnect();
            this.microphone.disconnect();
        },
        computed: { ...mapGetters(['localUser']) },
    };
</script>

<style lang="scss" scoped>
    .micVolumeIcon {
        position: relative;
    }
    .v-icon:first-child {
        color: white !important;
        left: 0;
    }
    .v-icon:last-child {
        position: absolute;
        left: 1px;
    }

    // .micVolumeIcon {
    //     display: inline-block;
    //     height: 25px;
    //     position: relative;
    //     vertical-align: middle;
    //     width: 2.5em;

    //     .v-icon {
    //         left: 0;
    //         position: absolute;
    //         text-align: center;
    //         width: 100%;
    //     }
    // }
</style>
