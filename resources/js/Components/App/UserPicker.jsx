import { Combobox, ComboboxButton, ComboboxInput } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react'

const UserPicker = ({value, options, onSelect}) => {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    const filteredPeople = query === "" ? 
                                    options : 
                                    options.filter(
                                        (person) => person.name
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "")
                                                        .includes(query
                                                            .toLowerCase()
                                                            .replace(/\s+/g, ""))
                                    );

    const onSelected = (persons) => {
        setSelected(persons);
        onSelect(persons);
    }

  return (
    <>
        <Combobox value={selected} onChange={onSelected} multiple >
            <div className='relative mt-1'>
                <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus:visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <ComboboxInput className="border-gray-300 dark:border-gray-900 dark:bg-gray-700 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full" 
                        displayValue={(persons) => 
                            persons.length
                                ? `${persons.length} users selected` : ""
                        }

                        placeholder='Select users...'
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    </ComboboxButton>
                </div>
                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={`w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible transition duration-100 ease-in data-leave:data-closed:opacity-0'`}
                >
                    {filteredPeople.map((person) => (
                        <ComboboxOption
                        key={person.id}
                        value={person}
                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                        <div className="text-sm/6 text-white">{person.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </div>
        </Combobox>
    </>
  )
}

export default UserPicker
