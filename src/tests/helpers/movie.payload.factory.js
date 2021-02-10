export const defaultTitle = "My movie";
export const defaultDescription = "My description";
export const defaultDirector = "My director";
export const defaultGenders = ["My gender1", "My gender2"];
export const defaultActors = ["My actor1", "My actor2"];

export const createMoviePayload = (optionalExtraPayload) => ({
  title: defaultTitle,
  description: defaultDescription,
  director: defaultDirector,
  genders: defaultGenders,
  actors: defaultActors,
  ...optionalExtraPayload,
});

export default {
  defaultTitle,
  defaultDescription,
  defaultDirector,
  defaultGenders,
  defaultActors,
  createMoviePayload,
};
