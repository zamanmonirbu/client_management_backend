import * as service from '../../src/modules/client/client.service';
import * as repo from '../../src/modules/client/client.repository';
import { AppError } from '../../src/utils/appError';

jest.mock('../../src/modules/client/client.repository');

const mockClient = {
  id: 'client-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  address: '123 Test St',
  dob: new Date('1990-01-01'),
  cell: '1234567890',
  companyName: 'Test Co',
  price: '1000',
  comments: 'Test client',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Client Service (Simplified)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createClientService', () => {
    it('should create a client successfully', async () => {
      (repo.createClient as jest.Mock).mockResolvedValue(mockClient);

      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Test St',
        dob: '1990-01-01',
        cell: '1234567890',
        companyName: 'Test Co',
        price: '1000',
      };

      const result = await service.createClientService(data);
      expect(repo.createClient).toHaveBeenCalled();
      expect(result).toEqual(mockClient);
    });

    it('should throw AppError if repository fails', async () => {
      (repo.createClient as jest.Mock).mockRejectedValue(new Error('DB fail'));
      await expect(service.createClientService({ ...mockClient })).rejects.toThrow(AppError);
    });
  });

  describe('listClientsService', () => {
    it('should return clients with pagination', async () => {
      (repo.findAllClients as jest.Mock).mockResolvedValue({ clients: [mockClient], total: 1 });

      const result = await service.listClientsService(1, 10, 'desc');
      expect(result.data.length).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it('should throw error if limit is invalid', async () => {
      await expect(service.listClientsService(1, 200)).rejects.toThrow(AppError);
    });
  });

  describe('getClientService', () => {
    it('should return a client by id', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(mockClient);
      const result = await service.getClientService('client-123');
      expect(result.id).toBe('client-123');
    });

    it('should throw if client not found', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(null);
      await expect(service.getClientService('x')).rejects.toThrow(AppError);
    });
  });

  describe('updateClientService', () => {
    it('should update client successfully', async () => {
      const updated = { ...mockClient, firstName: 'Jane' };
      (repo.findClientById as jest.Mock).mockResolvedValue(mockClient);
      (repo.updateClientById as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateClientService('client-123', { firstName: 'Jane' });
      expect(result.firstName).toBe('Jane');
    });

    it('should throw if client not found', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(null);
      await expect(service.updateClientService('x', {})).rejects.toThrow(AppError);
    });
  });

  describe('deleteClientService', () => {
    it('should delete client successfully', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(mockClient);
      (repo.deleteClientById as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteClientService('client-123')).resolves.toBeUndefined();
    });

    it('should throw if client not found', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteClientService('x')).rejects.toThrow(AppError);
    });
  });
});
