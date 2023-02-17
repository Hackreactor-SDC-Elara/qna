import gdown

def downloadFile(fileId, output):
  gdown.download(id=fileId, output=output, quiet=False, fuzzy=True)