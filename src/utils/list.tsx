const sortListInAlphabeticallyOrderASC = (list: []) => {
    return list.sort((a, b) => (a > b ? 1 : -1))
}

export {sortListInAlphabeticallyOrderASC}