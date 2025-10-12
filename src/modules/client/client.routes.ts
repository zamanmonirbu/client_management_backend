// src/routes/client.routes.ts

import { Router } from 'express';
import * as controller from './client.controller';
import validateRequest from '../../middleware/validateRequest';
import { clientCreateSchema, clientUpdateSchema } from './client.validator';

const router = Router();

router.get('/', controller.getClients);
router.get('/:id', controller.getClient);
router.post('/', validateRequest(clientCreateSchema), controller.createClient);
router.put('/:id', validateRequest(clientUpdateSchema), controller.updateClient);
router.delete('/:id', controller.deleteClient);

export default router;
