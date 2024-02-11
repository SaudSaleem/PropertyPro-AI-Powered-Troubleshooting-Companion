<template>
    <div class="flex flex-col md:flex-row">
        <div class="sidebar w-full md:w-64 bg-black relative h-52 md:h-[100vh]">
            <div class="flex h-10 items-center mt-4 pl-2">
                <i class="mdi mdi-account text-white text-[32px]"></i>
                <div class="ml-4 flex flex-col">
                    <span class="text-white text-sm capitalize">{{ userName }}</span>
                    <span class="text-white text-xs">{{ userEmail }}</span>
                </div>
            </div>
            <!-- NEW CHAT BUTTON -->
            <div class="flex justify-center">
                <div class="flex items-center justify-center w-[90%] px-4 py-2 bg-[#171717] rounded-md text-white mt-6"
                    role="button" tabindex="1" @click="newChat">
                    <i class="mdi mdi-message mr-3"></i>
                    New Chat
                </div>
            </div>
            <!-- LOGOUT BUTTON -->
            <div class="flex justify-center absolute bottom-8 w-full">
                <div class="flex items-center justify-center w-[90%] px-4 py-2 bg-[#171717] rounded-md text-white mt-6"
                    role="button" tabindex="1" @click="logout">
                    <i class="mdi mdi-logout mr-3"></i>
                    Logout
                </div>
            </div>
        </div>
        <div class="chat-area w-full flex flex-col pb-9 text-sm relative">
            <div
                class="sticky top-0 mb-1.5 flex items-center justify-between z-10 h-14 p-2 font-semibold bg-token-main-surface-primary">
                <div class="absolute left-1/2 -translate-x-1/2"></div>
                <div class="flex items-center gap-2">
                    <div class="group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium hover:bg-gray-50 radix-state-open:bg-gray-50 hover:bg-black/10 "
                        id="radix-:r2g8:">
                        <div class="text-white">PropertyPro</div>
                    </div>
                </div>
            </div>
            <div class="overflow-y-auto" id="chat-area">
                <div v-for="(message, index) in messages" :key="index" class="text-white">
                    <div class="w-full text-token-text-primary" data-testid="conversation-turn-3"
                        style="--avatar-color: #19c37d;">
                        <div class="px-4 py-2 justify-center text-base md:gap-6 m-auto">
                            <div
                                class="flex flex-1 text-base mx-auto gap-3 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group">
                                <div class="flex-shrink-0 flex flex-col relative items-end">
                                    <div>
                                        <div class="pt-0.5">
                                            <div class="flex items-center justify-center w-8 h-8 rounded-full"
                                                :class="message.role == 'assistant' ? 'bg-green-500' : 'bg-[#5a5858]'">
                                                <i class="mdi mdi-robot text-white text-2xl"
                                                    v-if="message.role == 'assistant'"></i>
                                                <i class="mdi mdi-account text-white text-3xl" v-else></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="relative flex w-full flex-col lg:w-[calc(100%-115px)]">
                                    <div class="font-semibold select-none" v-if="message.role == 'assistant'">Assistant
                                    </div>
                                    <div class="font-semibold select-none" v-else>You</div>
                                    <div class="flex-col gap-1 md:gap-3">
                                        <div class="flex flex-grow flex-col max-w-full">
                                            <div :data-message-id="index"
                                                class="min-h-[20px] text-message flex flex-col items-start gap-3 whitespace-pre-wrap break-words [.text-message+&amp;]:mt-5 overflow-x-auto">
                                                <div class="w-full break-words ">
                                                    <p>{{ message.content }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- TEXT AREA -->
            <div
                class="w-full absolute z-10 bottom-0 pt-2 md:pt-0 border-white/20 md:border-transparent md:w-[calc(100%-.5rem)] mt-4">
                <form
                    class="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                    <div class="relative flex h-full flex-1 items-stretch md:flex-col">
                        <div class="flex w-full items-center">
                            <div
                                class="overflow-hidden [&amp;:has(textarea:focus)]:border-token-border-xheavy [&amp;:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full  flex-grow relative border border-token-border-heavy text-white rounded-2xl">
                                <textarea id="prompt-textarea" tabindex="0" data-id="request-NEW:3-24" rows="1"
                                    placeholder="Message PROPERTYPRO..." v-model="newMessage" @keydown.enter="sendMessage"
                                    class="m-0 w-full resize-none border-0 py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 bg-transparent md:py-3.5 md:pr-12 placeholder-white/50  pl-3 md:pl-4"
                                    style="max-height: 200px; height: 52px; overflow-y: hidden;"></textarea><button
                                    @click="sendMessage"
                                    class="absolute md:bottom-3 md:right-3 hover:bg-white right-2 text-white p-0.5 border  rounded-lg border-white bg-white bottom-1.5 transition-colors"
                                    data-testid="send-button"><span class="" data-state="closed"><svg width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" class="text-black">
                                            <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg></span></button>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="relative px-2 py-2 text-center text-xs text-token-text-secondary md:px-[60px] text-white">
                    <span>PropertyPro can
                        make mistakes. Consider checking important information.</span>
                </div>
            </div>
        </div>

    </div>
</template>
<script>

export default {
    data() {
        return {
            userName: "",
            userEmail: "",
            messages: [
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
                { role: 'assistant', content: 'Hello! How can I assist you?' },
                { role: 'user', content: 'Hello! How can I need help' },
            ],
            newMessage: ''
        }
    },
    methods: {
        sendMessage(event) {
            if (event) {
                event.preventDefault();
            }
            if (this.newMessage.trim() !== '') {
                this.messages.push({ role: 'user', content: this.newMessage });
                this.newMessage = '';
                this.pageScroll();
                const payload = {
                    userPrompt: this.newMessage,
                };
                const chatId = this.getQueryParamValue('chatId');
                if (chatId) {
                    payload.chatId = chatId
                }
                // this.$axios.post('chat', payload)
                // .then((data) => {
                //     this.messages.push({role:'assistant', content: data.message});
                //     this.pageScroll();
                //     if(data.chatId){
                //         this.setQueryParam('chatId', data.chatId)
                //     }
                // })
            }
        },
        // move scroll bottom of the page when new message added or page refreshed
        pageScroll() {
            window.setTimeout(() => {
                const chatArea = document.getElementById('chat-area');
                chatArea.scrollTop = chatArea.scrollHeight;
            }, 200)

        },
        setQueryParam(paramName, paramValue) {
            const currentUrl = window.location.href;
            const url = new URL(currentUrl);
            url.searchParams.set(paramName, paramValue);
            const updatedUrl = url.toString();
        },
        fetchExistingChat(chatId) {
            const payload = { chatId }
            this.$axios.get('/chat', payload)
                .then((data) => {
                    this.$notyf.success("Chat is fetched Successfully");
                    this.messages = data.messages;
                })
        },
        hasQueryParam(paramName) {
            const queryParams = new URLSearchParams(window.location.search);
            return queryParams.has(paramName);
        },
        getQueryParamValue(paramName) {
            const queryParams = new URLSearchParams(window.location.search);
            return queryParams.get(paramName);
        },
        removeQueryParam(paramName) {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.delete(paramName);
            const newUrl = window.location.pathname + '?' + queryParams.toString();
            history.replaceState({}, '', newUrl);
        },
        newChat() {
            this.messages = [];
            this.removeQueryParam('chatId');
        },
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            this.$router.push('/login');
        }
    },
    mounted() {
        this.userName = localStorage.getItem('name');
        this.userEmail = localStorage.getItem('email');
        if (this.hasQueryParam('chatId')) {
            this.fetchExistingChat(this.getQueryParamValue('chatId'));
        }
    }
}
</script>
<style scoped>
.chat-area {
    /* width: calc(100% - 256px); */
    height: 100vh;
    background-color: #171717;
}

#chat-area {
    height: calc(100vh - 152px);
}
</style>