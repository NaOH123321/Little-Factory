import { GB2260 } from "./identity.data";

export const extractInfo = (idNo: string) => {
    const addrPart = idNo.substring(0, 6);
    const birthPart = idNo.substring(6, 14);
    const genderPart = parseInt(idNo.substring(14, 17));
    return {
        addrCode: addrPart,
        dateOfBirth: birthPart,
        gender: genderPart % 2 !== 0
    };
};

export function isValidAddr(code: string) {
    return GB2260[code] !== undefined;
}

export const getAddrByCode = (code: string) => {
    const province = GB2260[code.substring(0, 2) + "0000"];
    const city = GB2260[code.substring(0, 4) + "00"].replace(province, '');
    const district = GB2260[code].replace(province + city, '');
    return {
        province: province,
        city: city,
        district: district
    };
};