


const isNotEmptyString: (str?: string) => boolean = (str) => {
    if (str == null || str == undefined || str.length <= 0) {
        return false;
    }
    return true;
}


export { isNotEmptyString }