const { Types } = require('mongoose');

// Function to get paginated and sorted data from MongoDB collection
const useQuery = async (Model, query) => {
  try {
    const { page = 1, limit = 10, sort = '-_id' } = query;

    console.log(page, limit, sort);

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate skip (offset) based on page and limit
    const skip = (pageNumber - 1) * limitNumber;

    // Define allowed sorting fields to prevent malicious sorting
    const allowedSortFields = ['name', 'updatedAt']; // Excluding 'createdAt'
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortBy = allowedSortFields.includes(sort.replace('-', ''))
      ? sort
      : '-_id'; // Default to sorting by '_id'

    // Convert query object properties to proper MongoDB ObjectIDs
    for (const key in query) {
      if (Types.ObjectId.isValid(query[key])) {
        query[key] = Types.ObjectId(query[key]);
      }
    }

    // Build the query for finding data with pagination and sorting options
    const queryBuilder = Model.find()
      .skip(skip)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder });

    // Execute the query to get the paginated and sorted data
    const data = await queryBuilder;

    // Get the total count of documents in the collection (without pagination)
    const totalCount = await Model.countDocuments(query);

    return {
      data,
      page: pageNumber,
      limit: limitNumber,
      totalCount
    };
  } catch (error) {
    throw error;
  }
};

module.exports = useQuery;
