<div class="max-w-6xl mx-auto py-16 ">

    <h5 class="text-center text-gray-800 dark:text-gray-200 text-4xl font-bold py-3 ">Users</h5>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-3 xl:px-0 xl:grid-cols-4 gap-5">
        
        @forelse($users as $user)
            <div class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-black p-5 shadow rounded-lg">
                <div class="flex flex-col items-center pb-10">
                    <img src="https://i.pravatar.cc/100?u={{$user->name}}" alt="" class="w-24 h-24 mb-2.5  rounded-full shadow-lg">

                    <h5 class="mb-1 text-xl truncate font-medium text-gray-900 dark:text-gray-200">
                        {{ $user->name }}
                    </h5>
                    <span class="text-sm text-gray-500 dark:text-gray-200">
                        {{ $user->email }}
                    </span>
                    <div class="flex mt-4 space-x-3 md:mt-6">
                        <x-secondary-button>
                            Add Friend
                        </x-secondary-button>
                        <x-primary-button wire:click="message({{ $user->id }})">
                            Message
                        </x-primary-button>
                    </div>
                </div>
            </div>
        @empty
            <div class="text-center text-gray-900 dark:text-gray-200">
                <h5>No Users</h5>
            </div>
        @endforelse

    </div>
</div>
