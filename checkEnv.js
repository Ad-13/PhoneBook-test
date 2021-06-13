const availableEnv = ['dev', 'prod'];

process.env.NODE_ENV = availableEnv.find(x => x === process.env.NODE_ENV) ?? 'prod';
