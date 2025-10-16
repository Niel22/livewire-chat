import Joi from "joi";

export const staffSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required()
});

export const subAccountSchema = Joi.object({
    name: Joi.string().required(),
    staff_id: Joi.number().integer().required().label("Staff"),
});

export const passwordSchema = Joi.object({
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
});

export const userDetailsSchema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    date_joined: Joi.date().required().label("Date Joined"),
    payment_method: Joi.string().required().label("Payment Method"),
});