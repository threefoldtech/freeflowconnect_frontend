<template>
    <section class="mainControls">
        <v-dialog v-model="showExtraSettings" width="500">
            <v-card>
                <v-card-title class="primary">
                    <v-row align="center">
                        <v-col cols="1" class="ma-0 pa-0"></v-col>
                        <v-col cols="10" class="ma-0 pa-0" align="center">
                            <p class="mb-0 white--text">Settings</p>
                        </v-col>
                        <v-col cols="1" class="ma-0 pa-0">
                            <v-btn text icon @click="toggleSettings">
                                <v-icon color="white">close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text class="pt-5">
                    <v-slider
                            :tick-labels="qualityOptions"
                            :max="3"
                            step="1"
                            ticks="always"
                            label="Quality"
                            :tick-size="4"
                            v-model="quality"
                            @change="saveQualityOption"
                    ></v-slider>
                    <v-divider class="my-5"></v-divider>
                    <v-col align="center" justify="center">
                        <p class="text-center">Currently logged in as <b>{{localUser.userName}}</b></p>
                        <v-btn color="error" text @click="logout">Log out</v-btn>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- <v-card class="secondary pa-1" dark v-else> -->
        <v-row class="mx-2" justify="center" align="center" style="height:60px">
            <v-btn disabled v-if="camEnabled" @click="unpublishOwnFeed" icon class="mr-1">
                <v-icon>videocam</v-icon>
            </v-btn>

            <v-btn disabled v-else @click="publishOwnFeed" icon class="mr-1">
                <v-icon>videocam_off</v-icon>
            </v-btn>

            <v-btn v-if="muted" @click="toggleMute" icon class="mr-0">
                <v-icon>mic_off</v-icon>
            </v-btn>
            <v-btn v-else @click="toggleMute" icon class="mr-0">
                <v-icon>mic</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon class="mx-1" @click="$root.$emit('toggleGridPresentation')">
                <v-icon v-if="grid">grid_off</v-icon>
                <v-icon v-else>grid_on</v-icon>
            </v-btn>
            <v-btn @click="hangUp" dark icon class="red mx-2 endCall">
                <v-icon>call_end</v-icon>
            </v-btn>
            <!--      <v-btn @click="enableScreenShare" v-if="canScreenShare && screenShare === null" icon class="ml-1">-->
            <!--        <v-icon>screen_share</v-icon>-->
            <!--      </v-btn>-->
            <!--      <v-btn @click="disableScreenShare" v-else-if="canScreenShare" icon class="ml-1">-->
            <!--        <v-icon>stop_screen_share</v-icon>-->
            <!--      </v-btn>-->
            <v-spacer></v-spacer>
            <v-btn v-if="minimal" icon class="ml-1" @click="$root.$emit('toggleUserList')">
                <v-icon>group</v-icon>
            </v-btn>
            <v-btn icon class="mx-1" @click="$root.$emit('toggleSidebar')">
                <v-icon>chat_bubble</v-icon>
            </v-btn>
            <v-btn icon class="mx-1" @click="toggleSettings">
                <v-icon>settings</v-icon>
            </v-btn>
        </v-row>
    </section>
</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        data: function () {
            return {
                showExtraSettings: false,
                grid: true,
                camEnabled: null,
                minimal: null,
                quality: 0,
                qualityOptions: ["Auto", "Low", "Normal", "High"]
            }
        },
        computed: {
            ...mapGetters(['localUser'])
        },
        methods: {
            toggleSettings() {
            },
            hangUp() {
            },
            logout() {
            },
            saveQualityOption() {
                // this.setSnackbarMessage({
                //   text: `Quality set to ${this.qualityOptions[this.quality]}`
                // });
                // this.users[0].pluginHandle.send({
                //   message: { request: "configure", bitrate: 128000 * this.quality }
                // });
            },
        }
    }
</script>