import express from 'express';
import { fileService } from './services/fileService.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/files', async (req, res) => {
  const files = await fileService.listFiles();
  res.render('file_list', { files });
});

app.get('/file/:key', async (req, res) => {
  const { key } = req.params;
  const fileInfo = await fileService.getFileInfo(key);
  res.render('file_download', { fileInfo });
});

app.get('/download/:key', async (req, res) => {
  const { key } = req.params;
  const fileData = await fileService.getFile(key);
  res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(fileData);
});

app.post('/upload', express.raw({ type: 'application/octet-stream', limit: '10mb' }), async (req, res) => {
  const fileName = req.headers['x-file-name'] as string;
  await fileService.uploadFile(fileName, req.body);
  res.status(200).send('File uploaded successfully');
});

export default app;
