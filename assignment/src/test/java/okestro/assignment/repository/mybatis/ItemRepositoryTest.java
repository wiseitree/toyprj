package okestro.assignment.repository.mybatis;

import okestro.assignment.domain.Item;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
class ItemRepositoryTest {

    @Autowired
    ItemRepository itemRepository;

    @Test
    void save() {
        //given
        Item item = new Item("itemC", 10000, 10);

        //when
        Item savedItem = itemRepository.save(item);

        //then

    }

}