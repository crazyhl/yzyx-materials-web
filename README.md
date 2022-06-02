# Yzyx Materials (yzyx-materials-web)

有知有行黑板报计算机小工具 web 端

## 构建方式
直接使用自带的 dockerfile 就可以自己构建自己部署的镜像了。在构建之前先去 `/boot/axios` 修改对应你自己的 baseUrl。具体可以参考 [https://cn.vuejs.org/v2/cookbook/dockerize-vuejs-app.html](https://cn.vuejs.org/v2/cookbook/dockerize-vuejs-app.html) 来搞，当然直接使用下面的一条命令就可以了

* `docker build -t yourImageName .`

镜像构建后，可以使用 `docker run -it -p 8080:80 --rm --name yourContainerName yourImageName` 来测试成果。

如果不想使用镜像的方式构建，可以参照 `quasar` 的文档来自行编译。

<!-- A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js). -->
