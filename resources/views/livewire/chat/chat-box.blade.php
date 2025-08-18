<div 
x-data="{height:0, conversationElement: document.getElementById('conversation')}"
x-init="
    height= conversationElement.scrollHeight;
    $nextTick(() => conversationElement.scrollTop = height)

    Echo.private('user.{{ Auth::user()->id }}')
    .notification((notification)=>{
        if(notification['type'] === 'App\\Notifications\\MessageRead'){
            alert('message read');
        }
    });
"
@scroll-bottom.window="
    $nextTick(() => conversationElement.scrollTop = height)
"
class="w-full overflow-hidden ">

    <div class=" flex flex-col overflow-y-scroll grow h-full hide-scrollbar">
        <header class="w-full sticky inset-x-0 flex pb-[5px] pt-[5px] top-0 border-b z-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-black">
            <div class="flex w-full items-center px-2 lg:px-4 py-2 gap-2 md:gap-5">
                <a href="{{ route('chat.index') }}" class="shrink-0 md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left text-gray-800 dark:text-gray-200" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                    </svg>
                </a>

                <div class="shrink-0">
                    <x-avatar class="h-9 w-9 md:w-11 md:h-11" src='https://i.pravatar.cc/100?u={{$selectedConvo->getReceiver()->name}}' />
                </div>

                <h6 class="font-bold truncate text-gray-800 dark:text-gray-200">
                    {{ $selectedConvo->getReceiver()->name }}
                </h6>
            </div>
        </header>

        <main 
            @scroll="
                scrollTop = $el.scrollTop;

                if(scrollTop <= 0){
                    $wire.loadMore();
                }
            "
            @update-chat-height.window = "
            
                newHeight= $el.scrollHeight;

                oldHeight = height;
                $el.scrollTop = $el.scrollTop + (newHeight - oldHeight);

                height = newHeight;
            "
            id="conversation" class="flex flex-col gap-3 p-2 overflow-y-auto flex-grow overscroll-contain overflow-x-hidden w-full my-auto hide-scrollbar">

            @if($loadedMessages->count())

                @php
                    $previousMessage = null;
                @endphp

                @foreach($loadedMessages as $key => $message)

                    @if($key > 0)
                        @php
                            $previousMessage = $loadedMessages->get($key - 1);
                        @endphp
                    @endif

                    <div
                    wire:key="{{time().$key }}"
                    @class([
                        'max-w-[85%] md:max-w-[78%] flex w-auto gap-2 relative mt-3',
                        'ml-auto' => $message->sender_id === Auth::id()
                    ])>

                        <div @class([
                            'shrink-0',
                            'opacity-0' => $previousMessage?->sender_id == $message->sender_id,
                            'hidden' => $message->sender_id === Auth::id()
                        ])>
                            <x-avatar src='https://i.pravatar.cc/100?u={{$selectedConvo->getReceiver()->name}}'/>
                        </div>

                        <div @class(['flex flex-wrap text-[15px] rounded-lg p-2 flex flex-col text-black bg-[#f6f6f8fb]',
                            'rounded-bl-none border border-gray-200/48 bg-transparent dark:border-black text-gray-800 dark:text-gray-200' => ($message->sender_id === Auth::id()),
                            'rounded-br-none bg-blue-500 text-gray-800 dark:text-gray-200'=> ($message->sender_id !== Auth::id()) 
                        ])>

                        <p class="whitespace-normal text-sm md:text-base tracking-wide md:tracking-normal">
                            {{ $message->body }}
                        </p>

                        <div class="ml-auto flex gap-2">
                            <p @class([
                                'text-xs', 'text-gray-500 dark:text-gray-200' => ($message->sender_id !== Auth::id()),
                                'text-gray-800 dark:text-gray-200' => ($message->sender_id === Auth::id())
                            ])>
                                {{ $message->created_at->format('g:i a') }}
                            </p>

                            @if($message->sender_id === Auth::id())
                                <div>
                                    @if($message->isRead())
                                    <span @class([
                                        'text-blue-500'
                                        ])>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-all text-blue-500" viewBox="0 0 16 16">
                                                <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
                                                <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                                            </svg>
                                        </span>
                                    @else
                                        <span @class([
                                            'text-gray-200'
                                        ])>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2 text-gray-200" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
                                            </svg>
                                        </span>
                                    @endif
                                </div>
                            @endif
                        </div>

                        </div>
                    </div>
                @endforeach
            @else
                <div class="m-auto text-center justify-center flex flex-col gap-3">

                    <h4 class="font-medium text-gray-800 dark:text-gray-200 text-lg"> No Messages </h4>

                </div>
            @endif
            
        </main>

        <footer class="shrink-0 z-10 bg-white dark:bg-gray-800 inset-x-0">

            <div class="p-2 border-t border-white dark:border-black">
                <form
                    x-data="{body: @entangle('body')}"
                    @submit.prevent="$wire.sendMessage"
                    method="POST" autocapitalize="off"> 
                    @csrf

                    <input type="hidden" autocomplete="false" class="hidden">

                    <div class="grid grid-cols-12 gap-3">
                        <input x-model="body" type="text" autocomplete="off" autofocus placeholder="Write your message here"
                            maxlength="1700"
                            class="col-span-9 md:col-span-11 bg-gray-100 border-0 outline-none focus:border-0 focus:ring-0 rounded-lg hover:ring-0 focus:outline-none"
                        >

                        <button x-bind:disabled="!body?.trim()" type="submit" class="col-span-3 md:col-span-1 text-gray-800 dark:text-gray-200 cursor-pointer border rounded-md hover:bg-gray-700">Send</button>
                    </div>
                </form>

                @error('body')
                    <p>{{ $message }}</p>
                @enderror
            </div>

        </footer>
    </div>
</div>
