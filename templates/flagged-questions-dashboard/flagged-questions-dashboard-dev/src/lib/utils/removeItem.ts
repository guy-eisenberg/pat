function removeItem<T>(value: T, arr: T[]) {
  const newArr = [...arr];

  const removeIndex = newArr.findIndex((item) => item === value);
  if (removeIndex !== -1) newArr.splice(removeIndex, 1);

  return newArr;
}

export default removeItem;
