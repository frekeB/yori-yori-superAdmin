const breakObject = (o: object): string => {
    let string = '{'
    for (var key in o) {
        string += `\n    ${key}: ${(o as any)[key]}`
    }
    string += '\n}'
    return string
};


export default (fields: object): string => {
    let string = "";
    Object.keys(fields).map((key) => {
      const value = (fields as any)[key];
      let appendix = "";
      if (typeof value === "object")
        appendix = `\n${key}: ${breakObject(value)}`;
      else appendix = `\n${key}: ${value}`;
      string += appendix;
    });
    return string;
}