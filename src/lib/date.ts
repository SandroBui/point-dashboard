// Thêm function mới để xử lý UTC string không có timezone suffix
export const parseUTCStringToLocalDate = (utcString: string): Date => {
    // Thêm 'Z' vào cuối để chỉ định đây là UTC time
    const utcStringWithZ = utcString.endsWith('Z') ? utcString : `${utcString}Z`;
    return new Date(utcStringWithZ);
};