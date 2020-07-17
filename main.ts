import * as prompts from 'prompts';
import * as fs from 'fs';

(async () => {
  const {id, key} = await prompts([
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

  fs.writeFileSync('credentials.json', JSON.stringify({id, key}), 'utf8')
})()
