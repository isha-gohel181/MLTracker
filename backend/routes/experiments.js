const express = require('express');
const {
  getExperiments,
  getExperiment,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  getExperimentsForComparison,
  getExperimentStats
} = require('../controllers/experimentController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/stats', getExperimentStats);
router.get('/compare', getExperimentsForComparison);
router.get('/', getExperiments);
router.get('/:id', getExperiment);
router.post('/', createExperiment);
router.put('/:id', updateExperiment);
router.delete('/:id', deleteExperiment);

module.exports = router;