import { AppError } from '../../src/utils/appError';
import * as service from '../../src/modules/client/client.service';
import * as repo from '../../src/modules/client/client.repository';
import { ClientCreateDTO } from '../../src/modules/client/client.types';

jest.mock('../../src/modules/client/client.repository');
const mockRepo = repo as jest.Mocked<typeof repo>;

const mockClient = {
  id: 'client-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  address: '123 Main St',
  dob: new Date('1990-01-01'),
  cell: '1234567890',
  companyName: 'Test Company',
  price: '1000',
  comments: 'Test client',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Client Service Unit Tests (Simplified)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createClientService', () => {
    const clientData: ClientCreateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      address: '123 Main St',
      dob: new Date('1990-01-01'),
      cell: '1234567890',
      companyName: 'Test Company',
      price: '1000',
    };

    it('should create client successfully', async () => {
      mockRepo.findClientByEmail.mockResolvedValue(null);
      mockRepo.createClient.mockResolvedValue(mockClient);

      const result = await service.createClientService(clientData);

      expect(result).toEqual(mockClient);
      expect(mockRepo.createClient).toHaveBeenCalledWith(clientData);
    });

    it('should throw error if email already exists', async () => {
      mockRepo.findClientByEmail.mockResolvedValue(mockClient);

      await expect(service.createClientService(clientData)).rejects.toThrow(AppError);
      expect(mockRepo.createClient).not.toHaveBeenCalled();
    });
  });

  describe('listClientsService', () => {
    it('should list clients with pagination', async () => {
      const mockClients = [mockClient];
      mockRepo.findAllClients.mockResolvedValue({ clients: mockClients, total: 1 });

      const result = await service.listClientsService(1, 10);

      expect(result.data).toEqual(mockClients);
      expect(result.pagination.total).toBe(1);
      expect(mockRepo.findAllClients).toHaveBeenCalledWith(0, 10, 'desc');
    });
  });

  describe('getClientService', () => {
    it('should return client by id', async () => {
      mockRepo.findClientById.mockResolvedValue(mockClient);

      const result = await service.getClientService('client-123');
      expect(result).toEqual(mockClient);
    });

    it('should throw if not found', async () => {
      mockRepo.findClientById.mockResolvedValue(null);

      await expect(service.getClientService('invalid-id')).rejects.toThrow(AppError);
    });
  });

  describe('updateClientService', () => {
    it('should update client successfully', async () => {
      const updated = { ...mockClient, firstName: 'Jane' };
      mockRepo.findClientById.mockResolvedValue(mockClient);
      mockRepo.findClientByEmail.mockResolvedValue(null);
      mockRepo.updateClientById.mockResolvedValue(updated);

      const result = await service.updateClientService('client-123', { firstName: 'Jane' });

      expect(result).toEqual(updated);
      expect(mockRepo.updateClientById).toHaveBeenCalled();
    });

    it('should throw if client not found', async () => {
      mockRepo.findClientById.mockResolvedValue(null);

      await expect(
        service.updateClientService('invalid', { firstName: 'Jane' })
      ).rejects.toThrow(AppError);
    });
  });
-
  describe('deleteClientService', () => {
    it('should delete client successfully', async () => {
      mockRepo.findClientById.mockResolvedValue(mockClient);

      await service.deleteClientService('client-123');

      expect(mockRepo.findClientById).toHaveBeenCalledWith('client-123');
      expect(mockRepo.deleteClientById).toHaveBeenCalledWith('client-123');
    });

    it('should throw if not found', async () => {
      mockRepo.findClientById.mockResolvedValue(null);

      await expect(service.deleteClientService('invalid')).rejects.toThrow(AppError);
    });
  });
});
