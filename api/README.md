## Migration (TypeORM)

### Generate

```bash
$ nest build && yarn typeorm migration:generate ./db/migrations/sampleName -d ./db/data-source.ts
```

### Execute

This command will execute **all pending migrations** and run them in a sequence ordered by their timestamps.

```bash
$ nest build && yarn typeorm migration:run -d ./db/data-source.ts
```

### Revert

This command will execute down in the latest executed migration. If you need to revert multiple migrations you must call this command multiple times.

```bash
$ nest build && yarn typeorm migration:revert -d ./db/data-source.ts
```

### Drop

```bash
$ nest build && yarn typeorm schema:drop -d ./db/data-source.ts
```

## Seed

```bash
$ yarn seed --name GenesisSeeder
```
