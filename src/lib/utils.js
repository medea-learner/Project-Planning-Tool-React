// Convert snake_case to camelCase
const toCamelCase = (str) => {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  };
  
// Recursively transform object keys from snake_case to camelCase
export const transformToCamelCase = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(transformToCamelCase); // Recurse for arrays
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = toCamelCase(key);
        acc[camelKey] = transformToCamelCase(obj[key]); // Recurse for object
        return acc;
      }, {});
    }
    return obj; // Return the value if it's neither an object nor an array
};

export const handleServerError = (error, defaultMessage) => {
    if (error.response && (error.response.status === 400 || error.response.status === 403) && error.response.data) {
      const errorDetails = error.response.data;
      const errorMessage = Object.entries(errorDetails)
        .map(([field, messages]) => {
          // Normalize messages to an array if it's a string
          const messageList = Array.isArray(messages) ? messages : [messages];
          return field !== "non_field_errors"
            ? `${field}: ${messageList.join(', ')}`
            : messageList.join(', ');
        })
        .join('\n');
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message || defaultMessage);
    }
  };
