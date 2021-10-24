const express = require('express');
const router = express.Router();
const { getContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact} = require('../../controllers/contacts');
const { validContact, validUpdateContact, validPutContact, validStatusContact, validId } = require('./validation');
const guard = require('../../helpers/guard');
const wrapError = require('../../helpers/errorHandler');


router.get('/', guard, wrapError(getContacts));

router.get('/:contactId', guard, validId, wrapError(getContactById));

router.post('/', guard, validContact, wrapError(addContact));

router.delete('/:contactId', guard, validId, wrapError(removeContact));

router.put('/:contactId', guard, validId, validPutContact, wrapError(updateContact));

router.patch('/:contactId/favorite', guard, validId, validStatusContact, validUpdateContact, wrapError(updateStatusContact));

module.exports = router;