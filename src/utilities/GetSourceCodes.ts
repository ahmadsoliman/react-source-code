const GetSourceCodes = async (bundleMapPath = "/static/js/bundle.js.map") => {
  const getCodes = async () => {
    return await fetch(bundleMapPath).then((data) => data.json());
  };

  let sources: string[] = [];
  let codes: { [key: string]: string } = {};

  const data = await getCodes();

  data["sources"].forEach((source: string, i: number) => {
    if (!source.includes("node_modules") && !source.includes("webpack")) {
      sources.push(source);
      codes[source] = data["sourcesContent"][i];
    }
  });

  return { sources, codes };
};

export default GetSourceCodes;
