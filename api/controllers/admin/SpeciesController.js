import Species from '../../models/Species.js';

export const getAllSpecies = async (req, res) => {
  try {
    const species = await Species.find();
    res.json(species);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch species', error: err.message });
  }
};

export const createSpecies = async (req, res) => {
  try {
    const species = new Species({ name: req.body.name });
    await species.save();
    res.status(201).json(species);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create species', error: err.message });
  }
};

export const updateSpecies = async (req, res) => {
  try {
    const updated = await Species.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Species not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update species', error: err.message });
  }
};

export const deleteSpecies = async (req, res) => {
  try {
    const deleted = await Species.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Species not found' });
    res.json({ message: 'Species deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete species', error: err.message });
  }
};