import Joi from "joi";

export const groupSchema = Joi.object({
    name: Joi.string().required().label('Group Name'),
    description: Joi.string().required().label('Description'),
    member: Joi.string().required().label('Member'),
    admin_id: Joi.number().integer().required().label('Admin'),
    avatar: Joi.any().required().label('Avatar')
});