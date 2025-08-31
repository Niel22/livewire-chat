import { useEventBus } from '@/EventBus';
import { useForm, usePage } from '@inertiajs/react'
import React, { use, useState } from 'react'

const GroupModal = ({show = false, onClose = () => {}}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const {on, emit} = useEventBus();
    const [group, setGroup] = useState({});

    const {data, setData, processing, reset, post, put, errors} = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: []
    });

    const users = conversations.filter((c) => !c.is_group);

  return (
    <h1></h1>
  )
}

export default GroupModal
