const Contact = require("../model/schema/contact");

const listContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
    limit = 5,
    page = 1,
    offset = 0,
  } = query;

  const optionsSearch = { userId };
  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  };

  const results = await Contact.paginate(optionsSearch, {
    limit,
    offset,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'name email subscription -_id',
    },
  });
  const { docs: contacts, totalDocs: total } = results
  return { contacts, total, limit, offset, page }
};

//
const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({ contactId, userId }).populate({
    path: 'owner',
    select: 'name email subscription -_id',
  });
  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contact.findOneAndRemove({ contactId, userId });
  return result;
};

const addContact = async (userId, body) => {
  const result = await Contact.create({ ...body, userId });
  return result;
};


const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { contactId, userId },
    { ...body },
    { new: true }
  );
  return result;
};


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};