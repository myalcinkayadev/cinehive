import { config as dotenv } from 'dotenv';
import databaseConfig from './database.config';
import ormConfig from './orm.config';

dotenv();
export default ormConfig(databaseConfig());
