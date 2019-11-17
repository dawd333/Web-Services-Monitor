export const listToStringWithCount = list => {
  const counts = {};
  for (let i = 0; i < list.length; i++) {
    let num = list[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  let output = "";
  Object.entries(counts).forEach(e => {
    output+= e[0];
    output+= e[1] > 1 ? " (x" + e[1] + ")\n" : "\n"
  });
  return output;
};
