import { useEventBus } from '@/EventBus'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { CalendarIcon, EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { Link } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'

const GroupOptionsDropdown = ({selectedConversation, isLocked, isAdmin}) => {
  const { t } = useTranslation('convo');
    const {emit} = useEventBus();

    const handleLock = () => {
        axios.patch(route('group.lock', selectedConversation))
            .then((res) => {
                if(res.data.data.is_locked){
                    emit('toast.show', "Group Locked")
                }else{
                    emit('toast.show', "Group Unlocked")
                }
            })
            .catch((err) => {
              
            })
    }

  return (
    <div className="relative inline-block text-left">
      <Menu as="div">
        <div>
          <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </MenuButton>
        </div>

        <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50 border border-gray-200 dark:border-gray-700">
         
          <div className="p-1">
            <MenuItem>
              {({ active }) => (
                <Link
                  href={route('group.message.schedule', selectedConversation)}
                  className={`group flex w-full items-center gap-2 rounded-md truncate px-2 py-2 text-sm 
                              ${active ? "bg-gray-100 dark:bg-gray-700" : ""} 
                              text-gray-800 dark:text-gray-200`}
                >
                  <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                  {t('scheduleMessage')}
                </Link>
              )}
            </MenuItem>
          </div>

          {isAdmin() && 
            <>
              <div className="p-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                        onClick={handleLock}
                      className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm 
                                  ${active ? "bg-gray-100 dark:bg-gray-700" : ""} 
                                  text-gray-800 dark:text-gray-200`}
                    >
                      {isLocked ? (
                        <div className="flex items-center gap-1">
                            <LockOpenIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                            <span>{t('unlockGroup')}</span>
                        </div>
                        ) : (
                        <div className="flex items-center gap-1">
                            <LockClosedIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                            <span>{t('lockGroup')}</span>
                        </div>
                        )}
                    </button>
                  )}
                </MenuItem>
              </div>
              <div className="p-1">
                <MenuItem>
                  {({ active }) => (
                    <Link
                      href={route('group.member.add', selectedConversation)}
                      className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm 
                                  ${active ? "bg-gray-100 dark:bg-gray-700" : ""} 
                                  text-gray-800 dark:text-gray-200`}
                    >
                      <UserPlusIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                      {t('addMember')}
                    </Link>
                  )}
                </MenuItem>
              </div>
            </>
          }
        </MenuItems>
      </Menu>
    </div>
  )
}

export default GroupOptionsDropdown
