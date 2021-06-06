export const buildApiURL = (
  apiBase: string,
  route: string,
  args?: { [key: string]: string | number }
) => {
  let returnRoute = `${apiBase}${route}`;

  if (!args) {
    return returnRoute;
  }

  for (const key of Object.keys(args)) {
    if (!key || !args[key]) {
      continue;
    }
    returnRoute = returnRoute.replace(
      `{${key.toString()}}`,
      args[key].toString()
    );
  }

  // Remove all zero space white spaces and return url
  return returnRoute.replace(/[\u200B-\u200D\uFEFF]/g, '');
};
