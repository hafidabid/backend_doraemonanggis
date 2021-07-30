# Labpro backend doraemonanggis

dibuat dengan express  oleh hafid abi d 13519028.

## Installation

Gunakan docker untuk install.

```bash
sudo docker build -t be_labpro_abi .
```

## jalankan docker

```python
sudo docker run -d -p 6900:6900 be_labpro_abi
```

## Url Path
1. /api/toko (POST, PUT, DELTE, GET)
2. /api/toko/:id/dorayaki (POST, GET) -> untuk get dan post item baru ditoko
3. /api/toko/:id/dorayaki/:idDorayaki (PUT, PATCH) -> Untuk update stok dan kirim stok 
4. /api/toko/:id (GET)
5. /api/dorayaki (POST, PUT, DELTE, GET)
6. /api/dorayaki/:id (POST, PUT, DELTE, GET)
## License
[MIT](https://choosealicense.com/licenses/mit/)
