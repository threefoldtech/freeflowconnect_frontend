<template>
    <v-card class="chatGrid">
        <v-card-title class="primary header">
            <v-row align="center" justify="center" class="white--text px-2">
                <v-col cols="2" class="py-0">
                    <v-btn icon @click="setChatOpenStatus(false)">
                        <v-icon color="white">arrow_back</v-icon>
                    </v-btn>
                </v-col>
                <v-col align="center" class="py-0 ttl">
                    <h3>Messages</h3>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text class="inner" ref="chat" v-autoScroll>
            <template v-for="(message, index) in messages">
                <div
                    :key="`${index}_divider`"
                    class="text-center px-4"
                    v-if="showDivider(message, index)"
                >
                    <span
                        class="grey--text text--lighten-1 font-weight-light overline"
                        >{{ message.createdAt | parseToTime }}</span
                    >
                    <v-divider class="mb-1"></v-divider>
                </div>
                <div :key="index">
                    <TheChatMessage
                        :dense="
                            !showDivider(message, index) &&
                                message &&
                                messages[index - 1] &&
                                message.senderId ===
                                    messages[index - 1].senderId
                        "
                        :message="message"
                    />
                </div>
            </template>
        </v-card-text>
        <v-card-actions class="input grey lighten-4">
            <TheChatInput class="theChatInput" />
        </v-card-actions>
    </v-card>
</template>
<script>
    import moment from 'moment';
    import TheChatMessage from './TheChatMessage';
    import { mapGetters, mapMutations } from 'vuex';
    import autoScroll from '../directives/autoScroll';
    import TheChatInput from './TheChatInput';

    export default {
        directives: {
            autoScroll,
        },
        components: {
            TheChatMessage,
            TheChatInput,
        },
        props: {
            selectedUser: {
                required: true,
            },
        },
        computed: {
            ...mapGetters(['messages', 'isMobile', 'localUser']),
        },
        methods: {
            ...mapMutations(['setChatOpenStatus']),
            showDivider(message, index) {
                const previousMessage = this.messages[index - 1];
                if (!previousMessage) {
                    return true;
                }
                const time = moment(message.createdAt);

                return time.diff(previousMessage.createdAt, 'm') > 5;
            },
        },
        watch: {
            messages(val, oldVal) {
                if (val[val.length - 1].senderId == this.localUser.uuid) {
                    return;
                }
                let audio = new Audio('/notification.mp3');
                audio.play();
            },
        },
    };
</script>
<style lang="scss" scoped>
    .chatGrid {
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr auto;
        grid-template-areas: 'header' 'inner' 'input';
        border-radius: 0px !important;
        .header {
            grid-area: header;
        }
        .inner {
            grid-area: inner;
            position: absolute;
            height: 100%;
            overflow: auto;
        }
        .input {
            grid-area: input;
            .theChatInput {
                width: 100%;
            }
        }
    }
</style>
