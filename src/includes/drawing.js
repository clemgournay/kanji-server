export const GetDrawingKanjis = async (width, height, strokes, device) => {
  const resp = await fetch(`https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=jsapi`, {
    method: 'POST',
    body: JSON.stringify({
    api_level: "537.36",
    app_version: 0.4,
    device,
    input_type: "0",
    itc: "ja-t-i0-handwrit",
    options: "enable_pre_space",
    requests: [{
      ink: strokes,
      language: 'ja',
      max_completions: 0,
      max_num_results: 10,
      pre_context: '',
      writing_guide: {
      writing_guide_area_height: parseInt(height),
      writing_guide_area_width: parseInt(width),
      }
    }]
  }), headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
  });
  
  const data = await resp.json();
  let results = [];
  if (data.length > 0 && data[0] === 'SUCCESS') {
    if (data.length > 1) {
      const res = data[1];
      if (res.length > 0) {
        const obj = res[0];
        if (obj.length > 2) results = obj[1];
      }
    }
  }
  return results;
}
