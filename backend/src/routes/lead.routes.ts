import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();
const leadController = new LeadController();

const leadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST']).optional(),
    source: z.enum(['WEBSITE', 'INSTAGRAM', 'REFERRAL']).optional(),
  }),
});

router.use(protect);

router.get('/', leadController.getLeads);
router.get('/export', leadController.exportLeads);
router.post('/', validate(leadSchema), leadController.createLead);
router.get('/:id', leadController.getLeadById);
router.put('/:id', validate(leadSchema.partial()), leadController.updateLead);
router.delete('/:id', authorize('ADMIN'), leadController.deleteLead);

export default router;
