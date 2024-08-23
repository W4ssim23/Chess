export const getCharacter = (file) => String.fromCharCode(file + 96);

export const initialPostions = () => {
  const position = new Array(8).fill("").map((x) => new Array(8).fill(""));

  for (let i = 0; i < 8; i++) {
    position[6][i] = "wp";
    position[1][i] = "bp";
  }

  position[7][0] = "wr";
  position[7][1] = "wn";
  position[7][2] = "wb";
  position[7][3] = "wq";
  position[7][4] = "wk";
  position[7][5] = "wb";
  position[7][6] = "wn";
  position[7][7] = "wr";

  position[0][0] = "br";
  position[0][1] = "bn";
  position[0][2] = "bb";
  position[0][3] = "bq";
  position[0][4] = "bk";
  position[0][5] = "bb";
  position[0][6] = "bn";
  position[0][7] = "br";

  return position;
};
