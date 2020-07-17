import prompt from 'prompt';

(async () => {
  const {id, key} = await prompt([
    {
      type: 'text',
      name: 'id',
      message: 'Enter your github id',
    },
    {
      type: 'text',
      name: 'key',
      message: 'Enter your github oauth key'
    }
  ]);

  console.log(id, key)
})()
