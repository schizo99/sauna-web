import Influx from 'influx';
const influx = new Influx.InfluxDB({
    host: process.env.INFLUX_HOST || 'localhost',
    port: 80,
    database: 'sauna_db',
    schema: [
        {
            measurement: 'temperatures',
            fields: {
                temp: Influx.FieldType.INTEGER
            },
            tags: ['sauna']
        }
    ]
})
export default influx;