function appendClass(
  base?: string | false | undefined,
  ...append: (string | false | undefined)[]
): string | undefined {
  const finalClass = append.reduce((str, app) => {
    if (!app) return str;

    return `${str} ${app.trim()}`;
  }, base || '');

  return (finalClass as string | undefined)?.trim();
}

export default appendClass;
