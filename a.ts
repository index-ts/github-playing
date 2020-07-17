(async () => {
  const file = await fetch('credentials.json');
  console.log(file);
})()