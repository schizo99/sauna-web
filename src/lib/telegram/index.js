import Influx from 'influx';
const influx = new Influx.InfluxDB({
    host: process.env.INFLUX_HOST || 'localhost',
    port: process.env.INFLUX_PORT || '80',
    database: 'sauna_db',
    schema: [
        {
            measurement: 'telegram',
            fields: {
                date: Influx.FieldType.STRING
            },
            tags: ['sauna']
        }
    ]
})
export default influx;