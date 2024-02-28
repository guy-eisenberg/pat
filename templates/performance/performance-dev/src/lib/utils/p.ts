function p(path: string) {
  return `${import.meta.env.VITE_ROOT_URL}/${path}`;
}

export default p;
