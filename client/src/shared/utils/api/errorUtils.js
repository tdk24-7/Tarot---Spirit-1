// Utility function to enhance error details
export const enhanceNetworkError = (error) => {
  // Đã có thông tin chi tiết hơn, trả về như vậy
  if (error.response) {
    const enhancedError = {
      ...error,
      enhancedData: {
        type: 'ResponseError',
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        serverMessage: error.response.data?.message || 'Unknown server error'
      }
    };
    console.debug('Enhanced response error:', enhancedError.enhancedData);
    return enhancedError;
  }
  
  // Lỗi không có phản hồi (mạng, timeout, vv)
  if (error.request) {
    // Phân tích thêm thông tin từ lỗi
    const enhancedError = {
      ...error,
      enhancedData: {
        type: 'RequestError',
        isTimeout: error.code === 'ECONNABORTED',
        isNetworkError: !error.response && error.request,
        message: error.message
      }
    };
    console.debug('Enhanced request error:', enhancedError.enhancedData);
    return enhancedError;
  }
  
  // Lỗi khác
  return {
    ...error,
    enhancedData: {
      type: 'OtherError',
      message: error.message
    }
  };
}; 