import { city_data } from "./area.data";

export const getProvinces = () => {
    const provinces: string[] = [];
    for (const province in city_data) {
        if (province) {
            provinces.push(province);
        }
    }
    return [...provinces];
};

export const getCitiesByProvince = (province: string) => {
    if (!province || !city_data[province]) {
        return [];
    }
    const cities: string[] = [];
    for (const city in city_data[province]) {
        if (city) {
            cities.push(city);
        }
    }
    return [...cities];
};

export const getAreasByCity = (province: string, city: string) => {
    if (!province || !city || !city_data[province][city]) {
        return [];
    }
    const districts = city_data[province][city];
    return [...districts];
};