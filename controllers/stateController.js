const State = require('../models/State');

class StateController {
  // Get all states
  static async getAllStates(req, res) {
    try {
      const { page, limit, search } = req.query;
      
      if (search) {
        const states = await State.search(search);
        return res.json({
          message: 'States retrieved successfully',
          states,
          total: states.length
        });
      }
      
      if (page && limit) {
        const result = await State.findPaginated(parseInt(page), parseInt(limit));
        return res.json({
          message: 'States retrieved successfully',
          ...result
        });
      }
      
      const states = await State.findAll();
      res.json({
        message: 'States retrieved successfully',
        states,
        total: states.length
      });
    } catch (error) {
      console.error('Get all states error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get state by ID
  static async getStateById(req, res) {
    try {
      const { id } = req.params;
      const state = await State.findById(id);
      
      if (!state) {
        return res.status(404).json({ error: 'State not found' });
      }

      res.json({
        message: 'State retrieved successfully',
        state
      });
    } catch (error) {
      console.error('Get state by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new state
  static async createState(req, res) {
    try {
      const { state_name, logo } = req.body;

      if (!state_name) {
        return res.status(400).json({ error: 'State name is required' });
      }

      const stateExists = await State.stateExists(state_name);
      if (stateExists) {
        return res.status(400).json({ error: 'State already exists' });
      }

      const state = new State(state_name, logo);
      const stateId = await state.save();

      const newState = await State.findById(stateId);
      res.status(201).json({
        message: 'State created successfully',
        state: newState
      });
    } catch (error) {
      console.error('Create state error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update state
  static async updateState(req, res) {
    try {
      const { id } = req.params;
      const { state_name, logo } = req.body;

      if (!state_name) {
        return res.status(400).json({ error: 'State name is required' });
      }

      const existingState = await State.findById(id);
      if (!existingState) {
        return res.status(404).json({ error: 'State not found' });
      }

      const stateExists = await State.stateExists(state_name, id);
      if (stateExists) {
        return res.status(400).json({ error: 'State name already in use' });
      }

      const updated = await State.update(id, state_name, logo);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to update state' });
      }

      const updatedState = await State.findById(id);
      res.json({
        message: 'State updated successfully',
        state: updatedState
      });
    } catch (error) {
      console.error('Update state error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete state
  static async deleteState(req, res) {
    try {
      const { id } = req.params;

      const existingState = await State.findById(id);
      if (!existingState) {
        return res.status(404).json({ error: 'State not found' });
      }

      const deleted = await State.delete(id);
      if (!deleted) {
        return res.status(400).json({ error: 'Failed to delete state' });
      }

      res.json({
        message: 'State deleted successfully',
        deletedState: existingState
      });
    } catch (error) {
      console.error('Delete state error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search states
  static async searchStates(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const states = await State.search(q);
      res.json({
        message: 'Search completed successfully',
        query: q,
        states,
        total: states.length
      });
    } catch (error) {
      console.error('Search states error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get states statistics
  static async getStatesStats(req, res) {
    try {
      const totalStates = await State.getCount();
      const allStates = await State.findAll();
      
      const statesWithLogo = allStates.filter(state => state.logo).length;
      const statesWithoutLogo = totalStates - statesWithLogo;

      res.json({
        message: 'States statistics retrieved successfully',
        stats: {
          total: totalStates,
          withLogo: statesWithLogo,
          withoutLogo: statesWithoutLogo,
          logoPercentage: totalStates > 0 ? ((statesWithLogo / totalStates) * 100).toFixed(2) : 0
        }
      });
    } catch (error) {
      console.error('Get states stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = StateController;
