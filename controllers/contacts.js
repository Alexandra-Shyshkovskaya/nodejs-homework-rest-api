const Contacts = require('../repository/contacts');
const { HttpCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/customError');

const getContacts = async (req, res) => {
    const userId = req.user.id;
        const data = await Contacts.listContacts(userId, req.query);
        res.json({
            status: 'Success',
            code: HttpCode.OK,
            message: 'Contacts found',
            data: { ...data }
        });
};

const getContactById = async (req, res) => {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
        if (contact) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                message: 'Contact found',
                data: {
                    contact,
                },
            });
    }
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const addContact = async (req, res) => {
    const userId = req.user.id;
    const contact = await Contacts.addContact(userId, req.body);
        res.status(HttpCode.CREATED).json({
            status: 'Success',
            code: HttpCode.CREATED,
            message: 'Contact successfully created',
            data: {
                contact,
            },
        });
};

const removeContact = async (req, res) => {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
        if (contact) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                message: 'Contact deleted',
                data: {
                    contact,
                },
            });
    };
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const updateContact = async (req, res) => {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
        userId,
        req.params.contactId,
        req.body,
    );
    if (contact) {
        return res.json({
            status: 'Success',
            code: HttpCode.OK,
            message: 'Contact updated successfully',
            data: {
                contact,
            },
        });
    };
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const updateStatusContact = async (req, res) => {
    const userId = req.user.id
    const contact = await Contacts.updateContact(
        userId,
        req.params.contactId,
        req.body,
    );
        if (contact) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                message: 'Contact updated successfully',
                data: {
                    contact,
                },
            });
        };
        throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

module.exports = {
    getContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact,
};