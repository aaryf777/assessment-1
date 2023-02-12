
const debounceWrapper = () => {
    let tout;
    return (cb,delay,query) => {
        clearTimeout(tout);
        tout = setTimeout(() => cb(query),delay);
    }
}
export default debounceWrapper