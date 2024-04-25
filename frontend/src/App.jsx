import { useState } from "react";
import axios from "axios";

//https://dog.ceo/api/breeds/image/random
function App() {
  const [imgUrl, setImageUrl] = useState("");
  const [err, setError] = useState("");

  async function makeAnAPIRequest() {
    setError("");
    let response = await axios.get("https://randombig.cat/roar.json");
    setImageUrl(response.data.url);
  }

  return (
    <div>
      <div>Hello, click to generate a cat image</div>
      <button onClick={makeAnAPIRequest}>Generate</button>
      {err ? err : null}
      {imgUrl ? <img src={imgUrl} height={600} width={600} /> : null}
    </div>
  );
}

export default App;
